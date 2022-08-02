import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import ApplicationPageWrapper, {
  type ApplicationPageWrapperProps,
} from "./ApplicationPageWrapper";

type ApplicationPageWrapperComponent = typeof ApplicationPageWrapper;

export default {
  component: ApplicationPageWrapper,
  title: "Direct Intake/Application Page Wrapper",
} as ComponentMeta<ApplicationPageWrapperComponent>;

const Template: ComponentStory<ApplicationPageWrapperComponent> = (args) => {
  return (
    <ApplicationPageWrapper {...args}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
        imperdiet ullamcorper pharetra. Suspendisse ullamcorper diam leo, sit
        amet finibus metus varius in. Donec congue orci at neque mattis viverra.
        Nunc ultrices imperdiet nulla ut ultrices. Nullam tempus odio magna, vel
        euismod nulla semper quis. Nulla rutrum quam metus. Suspendisse ac ex
        nec mi malesuada convallis. Vivamus cursus orci vitae velit ullamcorper
        eleifend. Sed est elit, dapibus sed tortor nec, fringilla venenatis
        libero. In ornare fermentum elit, sed mattis urna semper non. Cras quis
        odio sit amet leo hendrerit consectetur id a magna.
      </p>
      <p>
        Vivamus vel est ex. Vivamus ut aliquam mi. Morbi faucibus malesuada
        urna, a posuere sapien dapibus eget. Aenean vulputate metus feugiat urna
        sagittis hendrerit. Vivamus convallis, lorem ut facilisis egestas, quam
        sapien lobortis dui, eu convallis nunc sem eget leo. Interdum et
        malesuada fames ac ante ipsum primis in faucibus. Nam porta facilisis
        cursus. Nulla euismod lectus malesuada diam molestie elementum. Sed
        egestas interdum ex nec venenatis. Praesent tincidunt dapibus enim, sed
        volutpat lorem molestie id.
      </p>
      <p>
        Maecenas elementum, erat id pharetra accumsan, mauris tellus volutpat
        lorem, at pulvinar nunc sem convallis lacus. Integer sapien orci,
        tristique vel vulputate sit amet, efficitur ut lorem. Etiam lectus arcu,
        accumsan sit amet lacus a, semper malesuada nulla. Nam posuere euismod
        tortor non dapibus. Mauris dapibus vel arcu quis placerat. Pellentesque
        varius vestibulum mauris, vel malesuada eros aliquet vel. Mauris
        vulputate sagittis dapibus.
      </p>
      <p>
        Mauris ullamcorper at metus ac tristique. Nunc maximus venenatis nisi
        vel ultrices. Vivamus posuere dolor nec vestibulum vulputate. Sed
        blandit condimentum lacus. Etiam rhoncus nibh et sapien efficitur
        sodales. Curabitur sit amet odio nec neque pellentesque ultrices.
        Aliquam rutrum non ipsum sit amet rhoncus. Pellentesque tortor tortor,
        egestas eget fermentum non, egestas quis urna. Aliquam tempor, tellus
        aliquam convallis vestibulum, urna erat faucibus nunc, et consectetur
        lacus tortor et dolor. Proin sagittis ex et quam hendrerit lacinia.
        Etiam non nisi efficitur nibh vulputate fringilla. Interdum et malesuada
        fames ac ante ipsum primis in faucibus. Phasellus malesuada euismod nisi
        eu lobortis. Integer sodales nunc eu varius ornare.
      </p>
      <p>
        Sed nec ullamcorper metus. Nulla sit amet arcu ornare, condimentum
        ligula porttitor, bibendum massa. Duis sagittis suscipit purus, ac
        ultrices est condimentum sit amet. Fusce vulputate facilisis nunc ac
        pellentesque. Nunc a arcu nisi. Morbi scelerisque velit ut sem lacinia
        commodo. Duis viverra turpis neque, at cursus mauris ullamcorper a.
        Nulla a cursus mauris. Nulla ut justo vulputate sapien ornare vulputate.
        Praesent fermentum metus sed ipsum blandit, ac faucibus dui vestibulum.
        Vestibulum sed ex eget mi iaculis convallis ut eget mauris. Nullam
        lectus neque, ultricies vitae est ut, consectetur semper felis.
        Curabitur eu semper lorem. Proin tristique augue quis sapien volutpat,
        in vehicula lectus accumsan. Phasellus hendrerit eleifend eleifend.
      </p>
    </ApplicationPageWrapper>
  );
};

const TODAY = new Date();

export const BasicApplicationPageWrapper = Template.bind({});
BasicApplicationPageWrapper.args = {
  title: "Basic Application Page Wrapper",
  subtitle: "Subtitle for Page Wrapper",
  closingDate: new Date(new Date(TODAY).setMonth(TODAY.getMonth() + 1)),
  crumbs: [{ title: "Pool Name" }, { title: "About Me" }],
  navigation: {
    currentStep: 1,
    steps: [
      {
        path: "#step-one",
        label: "Step One",
      },
      {
        path: "#step-two",
        label: "Step Two",
      },
    ],
  },
};
